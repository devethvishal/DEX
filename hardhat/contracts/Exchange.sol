//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public cryptoDevTokenAddress;

    constructor(address _cryptoDevTokenAddress)
        ERC20("CryptoDev LP Token", "CDLP")
    {
        require(
            _cryptoDevTokenAddress != address(0),
            "TokenAddress passed is a null address."
        );
        cryptoDevTokenAddress = _cryptoDevTokenAddress;
    }

    function getReserve() public view returns (uint256) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint256 _tokenAmount)
        public
        payable
        returns (uint256)
    {
        uint256 liquidity;
        uint256 tokenReserve = getReserve();
        uint256 ethBalance = address(this).balance;

        if (tokenReserve == 0) {
            ERC20(cryptoDevTokenAddress).transferFrom(
                msg.sender,
                address(this),
                _tokenAmount
            );
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            uint256 ethReserve = address(this).balance - msg.value;
            uint256 cryptoDevTokenAmount = (msg.value * tokenReserve) /
                ethReserve;

            require(
                (_tokenAmount >= cryptoDevTokenAmount),
                "Token amount sent is less than the minimum token amount that can be added."
            );
            ERC20(cryptoDevTokenAddress).transferFrom(
                msg.sender,
                address(this),
                cryptoDevTokenAmount
            );
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }

    function removeLiquidity(uint256 _amount)
        public
        returns (uint256, uint256)
    {
        require(_amount > 0, "Amount cannot be zero.");
        uint256 ethReserve = address(this).balance;
        uint256 _totalSupply = totalSupply();
        uint256 ethAmount = (ethReserve * _amount) / _totalSupply;
        uint256 cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmount);
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }

    function getAmountOfToken(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (100 * inputReserve) + inputAmountWithFee;
        return (numerator / denominator);
    }

    function ethToCryptoDevToken(uint256 _minToken) public payable {
        uint256 tokenReserve = getReserve();
        uint256 tokenBought = getAmountOfToken(
            msg.value,
            address(this).balance,
            tokenReserve
        );
        require(tokenBought >= _minToken, "Insufficient output Amount");
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokenBought);
    }

    function cryptoDevTokenToEth(uint256 _tokenSold, uint256 _minEth) public {
        uint256 tokenReserve = getReserve();

        uint256 ethBought = getAmountOfToken(
            _tokenSold,
            tokenReserve,
            address(this).balance
        );

        require(ethBought >= _minEth, "Insufficient Output Amount");

        payable(msg.sender).transfer(ethBought);
    }
}
