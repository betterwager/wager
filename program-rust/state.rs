use borsh::{BorshDeserialize, BorshSchema, BorshSerialize};
use solana_program::{
    //clock::UnixTimestamp,
    msg,
    program_error::ProgramError,
    program_pack::{Pack, Sealed},
};

#[derive(Clone, Copy, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq, Default)]
pub struct OptionType {
    pub name : [u8; 20],
    pub vote_count : u16,
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub struct WagerAccount {
    pub balance : u32,
    pub options : [OptionType; 8],
    //minbet maxbet minplayers maxplayers
    pub params : (u32, u32, u16, u16),
    pub player_counter : u16,
    pub vote_counter : u16,
    pub bump_seed : u8,
    pub state : WagerState,
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub enum WagerState {
    Uninitialized,
    Ongoing,
    Settled,
}

impl Sealed for WagerAccount {}
impl Pack for WagerAccount {
    const LEN: usize = 197;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let data = self.try_to_vec().unwrap();
        dst[..data.len()].copy_from_slice(&data);
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut mut_src = src;
        Self::deserialize(&mut mut_src).map_err(|err| {
            msg!(
                "Error: failed to deserialize wager account: {}",
                err
            );
            ProgramError::InvalidAccountData
        })
    }
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub struct PlayerAccount {
    pub option_name : [u8; 20],
    pub bet_amount : u32,
    pub voted : u8,
    pub bump_seed :u8
}
impl Sealed for PlayerAccount {}
impl Pack for PlayerAccount {
    const LEN: usize = 26;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let data = self.try_to_vec().unwrap();
        dst[..data.len()].copy_from_slice(&data);
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut mut_src = src;
        Self::deserialize(&mut mut_src).map_err(|err| {
            msg!(
                "Error: failed to deserialize player account: {}",
                err
            );
            ProgramError::InvalidAccountData
        })
    }
}


#[cfg(test)]
mod tests {
    //use solana_program::program_pack::Pack;

    use borsh::BorshSerialize;

    use crate::{state::{PlayerAccount, OptionType}, instruction::WagerInstruction};

    use super::{WagerAccount, /*OptionType*/};

    #[test]
    fn it_works() {
        //let option1 : OptionType = OptionType { name: vec![0,1,2,3,4], vote_count: 0};
        //let option2 : OptionType = OptionType { name: vec![5,6,7,8,9], vote_count: 0};
        //let test_account : WagerAccount = WagerAccount { balance: 0, options: vec![option1,option2], params: (12,123,12,20), player_counter: 5, bump_seed: 2, state: super::WagerState::Ongoing};
        //assert_eq!(solana_program::borsh::get_packed_len::<WagerAccount>(), WagerAccount::get_packed_len());
        println!("{}", solana_program::borsh::get_packed_len::<WagerAccount>());
        println!("{}", solana_program::borsh::get_packed_len::<PlayerAccount>());

        let temp_options : [OptionType; 8] = [{OptionType {name : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], vote_count : 0}}; 8];
        let temp_account : WagerAccount = WagerAccount { balance: 0, options: temp_options, params: (12,123,12,123), player_counter: 1, vote_counter: 0, bump_seed: 0, state: crate::state::WagerState::Ongoing };
        let temp_instruction : WagerInstruction = WagerInstruction::NewWager {name : [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10], account_state : temp_account};
        let buffer_template : Vec<u8> = temp_instruction.try_to_vec().unwrap();
        println!("{:?}", buffer_template);

    }
}