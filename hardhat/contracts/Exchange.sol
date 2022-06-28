//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {

    address public cryptoDevTokenAddress;
    constructor(address _cryptoDevTokenAddress) ERC20("CryptoDev LP Token", "CDLP") {
        require(_cryptoDevTokenAddress != address(0),"TokenAddress passed is a null address.");
        cryptoDevTokenAddress = _cryptoDevTokenAddress;
    }

    function getReserve() public view returns(uint) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }


    function addLiquidity (uint _tokenAmount) public payable returns(uint) {
        uint liquidity;
        uint tokenReserve = getReserve();
        uint ethBalance = address(this).balance;

        if(tokenReserve == 0) {
            ERC20(cryptoDevTokenAddress).transferFrom(msg.sender, address(this), _tokenAmount);
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            uint ethReserve = address(this).balance - msg.value;
            uint cryptoDevTokenAmount = (msg.value * tokenReserve) / ethReserve;

            require((_tokenAmount >= cryptoDevTokenAmount),"Token amount sent is less than the minimum token amount that can be added."); 
            ERC20(cryptoDevTokenAddress).transferFrom(msg.sender, address(this), cryptoDevTokenAmount);
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }

    }

}