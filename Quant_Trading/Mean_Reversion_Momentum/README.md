# Factor-Based Trading Strategies

## Overview
This project implements and analyzes two factor-based trading strategies using S&P 600 small-cap stock data. We explore how combining signals from different time horizons can create a more robust trading system with improved risk-adjusted returns.

## Data
- **Dataset**: Daily stock prices for S&P 600 constituents
- **Time Period**: Approximately 3 years (end of 2012 to end of 2015)
- **Dimensions**: 757 trading days × 574 stocks

## Implemented Strategies

### 1. Short-Term Mean Reversion (MR)
Based on the tendency of stocks to temporarily reverse direction after short-term price movements.

**Implementation**:
- Calculate rolling 5-day sum of returns
- Multiply by -1 (contrarian approach: short recent winners, buy recent losers)
- Standardize signals cross-sectionally each day (z-score)
- Trade: Apply signals to next day's returns

### 2. Momentum (MOM)
Captures the tendency of stocks to continue their trend over longer horizons.

**Implementation**:
- Skip the most recent month (22 trading days) to avoid short-term mean reversion
- Calculate rolling sum of returns over past 231 trading days (~1 year)
- Standardize signals cross-sectionally (z-score)
- Trade: Apply signals to same-day returns

## Performance Metrics
- **Annualized Returns**: Daily mean × 252
- **Annualized Volatility**: Daily standard deviation × √252
- **Sharpe Ratio**: Annualized return ÷ Annualized volatility
- Initial analysis shows:
  - Momentum: Sharpe ratio ~0.83
  - Mean Reversion: Sharpe ratio ~0.87

## Portfolio Construction
We explore the optimal combination of these strategies to maximize risk-adjusted returns:

1. **Equal-Weighted Combination**: 50% allocation to each strategy
2. **Optimal Sharpe Ratio Allocation**: Based on mean-variance optimization
   - Uses the formula: w* = (Σ^(-1) μ) / (1^T Σ^(-1) μ)
   - Where μ is the vector of expected returns and Σ is the covariance matrix

## Key Findings
- The two strategies demonstrate low correlation due to their different time horizons
- Combined portfolio achieves higher Sharpe ratio than either strategy alone
- Demonstrates the diversification benefit of combining strategies with different market drivers

## Visualization
- Cumulative P&L for each strategy
- Volatility-scaled cumulative performance for fair comparison
- Correlation analysis between factor returns


## Requirements
- pandas
- matplotlib

## Further Development
- Extend to additional factors (value, quality, low volatility)
- Test strategies across different market regimes
- Implement transaction costs and optimization constraints
- Explore alternative weighting schemes

## Contributors
- Aryavrat Gupta
