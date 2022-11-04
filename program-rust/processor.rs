use std::u8;

use crate::{instruction::*, get_pot_address_checked, state::*, get_player_address_checked};

use borsh::BorshDeserialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    program::{/* invoke,  */invoke_signed},
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
    system_instruction,
    msg, 
};

pub fn process_instruction (
    program_id : &Pubkey,
    accounts : &[AccountInfo],
    instruction_data : &[u8]
) -> ProgramResult {
    msg!("Running program");
    let instruction = WagerInstruction::unpack_from_slice(instruction_data)?;
    let account_info_iter = &mut accounts.iter();

    match instruction {
        WagerInstruction::NewWager { name, account_state } => {
            msg!("WagerInstruction::NewWager");
            let funder_info = next_account_info(account_info_iter)?;
            let pot_info = next_account_info(account_info_iter)?;
            let system_program_info = next_account_info(account_info_iter)?;
            let rent_sysvar_info = next_account_info(account_info_iter)?;
            let rent = &Rent::from_account_info(rent_sysvar_info)?;

            let (_,pot_bump_seed) = get_pot_address_checked(name, pot_info.key)?;
            //let pot_bump_seed = account_state.bump_seed;
            
            let pot_signer_seeds : &[&[_]] = &[
                &name,
                &[pot_bump_seed]
            ];

            invoke_signed(
                &system_instruction::create_account(
                    funder_info.key,
                    pot_info.key,
                    1.max(rent.minimum_balance(WagerAccount::get_packed_len())),
                    WagerAccount::get_packed_len() as u64,
                    program_id
                ),
                &[
                    funder_info.clone(),
                    pot_info.clone(),
                    system_program_info.clone(),
                ],
                &[pot_signer_seeds]
            )?;
            account_state.pack_into_slice(&mut pot_info.data.borrow_mut())

        },
        WagerInstruction::MakeBet {bet_identifier,player_state} => {
            msg!("WagerInstruction::MakeBet");
            let funder_info = next_account_info(account_info_iter)?;
            let pot_info = next_account_info(account_info_iter)?;
            let player_info = next_account_info(account_info_iter)?;
            let system_program_info = next_account_info(account_info_iter)?;
            let rent_sysvar_info = next_account_info(account_info_iter)?;
            let rent = &Rent::from_account_info(rent_sysvar_info)?;

            let (_,player_bump_seed) = get_player_address_checked(bet_identifier, funder_info.key.to_bytes(), player_info.key)?;
            //let (_,player_bump_seed) = get_player_address(bet_identifier, funder_info.key.to_bytes());

            let player_signer_seeds : &[&[_]] = &[
                &bet_identifier,
                &funder_info.key.to_bytes(),
                &[player_bump_seed]
            ];

            let mut pot_account = WagerAccount::try_from_slice(&mut pot_info.data.borrow_mut())?;
            pot_account.player_counter += 1 ;

            let pot_signer_seeds : &[&[_]] = &[
                &bet_identifier,
                &[pot_account.bump_seed]
            ];

            invoke_signed(
                &system_instruction::create_account(
                    funder_info.key,
                    player_info.key,
                    1.max(rent.minimum_balance(PlayerAccount::get_packed_len())),
                    PlayerAccount::get_packed_len() as u64,
                    program_id
                ),
                &[
                    funder_info.clone(),
                    player_info.clone(),
                    system_program_info.clone(),
                ],
                &[player_signer_seeds,pot_signer_seeds]
            )?;
            invoke_signed(
                &system_instruction::transfer(
                funder_info.key, 
                pot_info.key, 
                player_state.bet_amount.into()
            ),
            &[
                funder_info.clone(),
                pot_info.clone(),
            ], 
            &[
                pot_signer_seeds
            ])?;
            pot_account.balance += player_state.bet_amount;
            pot_account.pack_into_slice(&mut pot_info.data.borrow_mut());
            player_state.pack_into_slice(&mut player_info.data.borrow_mut());
        },
        WagerInstruction::VoteWinner {outcome } => {
            msg!(&outcome.to_string());
            msg!("WagerInstruction::VoteWinner");
            let funder_info = next_account_info(account_info_iter)?;
            let pot_info = next_account_info(account_info_iter)?;
            let player_info = next_account_info(account_info_iter)?;
            //let system_program_info = next_account_info(account_info_iter)?;
            /* let rent_sysvar_info = next_account_info(account_info_iter)?;
            let rent = &Rent::from_account_info(rent_sysvar_info)?; */

            let mut player_account = PlayerAccount::try_from_slice(&mut player_info.data.borrow_mut())?;
            let mut pot_account = WagerAccount::try_from_slice(&mut pot_info.data.borrow_mut())?;
            
            if player_account.voted == 0 {
                
                let outcome_index : usize = outcome.into();
                pot_account.options[outcome_index].vote_count += 1;
                pot_account.vote_counter += 1;
                player_account.voted = 1;

                if pot_account.vote_counter == pot_account.player_counter {
                    let temp_winner : OptionType = {OptionType {name : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], vote_count : 0}};
                    for i in pot_account.options {
                        if i.vote_count > temp_winner.vote_count;
                        temp_winner = i;
                    }
                }

            } else {
                msg!("Account already voted");
                ProgramError::Custom(100);
            }

        },
        WagerInstruction::View => {

        },

    }
    Ok(())
}