import axios from 'axios';

// This appears to be a successful API response from Finnhub.
// It's not clear if every API call will have all these fields...
export interface CompanyAPISuccess {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string; // i.e. "Technology"
  ipo: string; // The string of a date.
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

// This appears to be the Error response from Finnhub.
export interface CompanyAPIError {
  error: string;
}

// Select company data to return for routes.
// Pick whatever fields you want from CompanyAPISuccess, but
// make sure they exist to use this interface.
export interface SelectComanyData {
  name: string;
}

// Custom error type for making a request.
export interface ErrorData {
  errorType: 'API' | 'REQUEST';
  message: string;
  status: string;
}

// This is the response from the getCompany function
// call.
export interface CompanyResponse {
  error: boolean;
  found: boolean;
  errorData?: ErrorData;
  successData?: SelectComanyData;
}

/**
 * This function takes a stock symbol and Finnhub API key, and makes a
 * request to the Finnhub Company API endpoint.
 *
 *
 * @remarks
 * This might be useful in checking for valid stock symbols. However,
 * a different function/API endpoint would be needed to check non-stock
 * like Forex, Options, Crypto, etc.
 *
 *
 * @param symbol  - stock symbol
 * @param apiKey  - Finnhub API key.
 * @returns - A promise that resolves with CompanyResponse type.
 *
 */
export const getCompany = async ({
  symbol,
  apiKey,
}: {
  symbol: string;
  apiKey: string;
}): Promise<CompanyResponse> => {
  try {
    const apiResponse = await axios({
      method: 'GET',
      url: `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`,
    });

    // Check for success case.
    if (apiResponse.data.name && apiResponse.data.name.length) {
      const successData = {
        name: apiResponse.data.name,
      };
      return { error: false, found: true, successData };
    }

    // The API call had an error, but the error was related to the
    // API and not the actual Axios request.
    const errorData: ErrorData = {
      errorType: 'API',
      message: apiResponse.data.error ?? '',
      status: apiResponse.data.status,
    };
    return { error: false, errorData, found: false };
  } catch (err) {
    // There was an error related to the request (and/or possibly the connection).
    const errorData: ErrorData = {
      errorType: 'REQUEST',
      message: (err as Error).message,
      status: '400',
    };
    return { error: true, errorData, found: false };
  }
};
