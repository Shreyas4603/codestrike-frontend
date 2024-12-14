import axios from "axios";
import Cookies from "js-cookie";

// Base URL for API requests
const baseUrl = ( import.meta.env.VITE_BACKEND_URL) + "/api";

/**
 * Common configuration for axios requests.
 * @param {Object} options - Additional options for axios request.
 * @param {number} [options.timeout=10000] - Timeout for the request in milliseconds.
 * @param {Object} [options.headers={}] - Additional headers for the request.
 * @returns {Object} - Axios request configuration.
 */
const createConfig = (options = {}) => {
  const { timeout = 10000, headers = {} } = options;

  return {
    baseURL: baseUrl,
    timeout,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Cookies.get("token")}`,
      ...headers, // Merge additional headers if provided
    },
  };
};

/**
 * Fetches data from a specified endpoint using GET method.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {Object} [options] - Additional options for the request.
 * @returns {Promise<{response: Object, refetch: Function}>} - The response object and a refetch function.
 * @throws Will throw an error if the request fails.
 */
export const getData = async (endpoint, options = {}) => {
  try {
    const config = createConfig(options);
    const response = await axios.get(endpoint, config);
    return {
      response,
      refetch: () => getData(endpoint, options),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

/**
 * Sends data to a specified endpoint using POST method.
 * @param {string} endpoint - The API endpoint to send data to.
 * @param {Object} data - The data to send in the request body.
 * @param {Object} [options] - Additional options for the request.
 * @returns {Promise<{response: Object, refetch: Function}>} - The response object and a refetch function.
 * @throws Will throw an error if the request fails.
 */
export const postData = async (endpoint, data, options = {}) => {
  try {
    const config = createConfig(options);
    const response = await axios.post(endpoint, data, config);
    return {
      response,
      refetch: () => postData(endpoint, data, options),
    };
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

/**
 * Updates data at a specified endpoint using PUT method.
 * @param {string} endpoint - The API endpoint to update data at.
 * @param {Object} data - The data to send in the request body.
 * @param {Object} [options] - Additional options for the request.
 * @returns {Promise<{response: Object, refetch: Function}>} - The response object and a refetch function.
 * @throws Will throw an error if the request fails.
 */
export const putData = async (endpoint, data, options = {}) => {
  try {
    const config = createConfig(options);
    const response = await axios.put(endpoint, data, config);
    return {
      response,
      refetch: () => putData(endpoint, data, options),
    };
  } catch (error) {
    console.error("Error putting data:", error);
    throw error;
  }
};

/**
 * Partially updates data at a specified endpoint using PATCH method.
 * @param {string} endpoint - The API endpoint to partially update data at.
 * @param {Object} data - The data to send in the request body.
 * @param {Object} [options] - Additional options for the request.
 * @returns {Promise<{response: Object, refetch: Function}>} - The response object and a refetch function.
 * @throws Will throw an error if the request fails.
 */
export const patchData = async (endpoint, data, options = {}) => {
  try {
    const config = createConfig(options);
    const response = await axios.patch(endpoint, data, config);
    return {
      response,
      refetch: () => patchData(endpoint, data, options),
    };
  } catch (error) {
    console.error("Error patching data:", error);
    throw error;
  }
};

/**
 * Deletes data at a specified endpoint using DELETE method.
 * @param {string} endpoint - The API endpoint to delete data from.
 * @param {Object} [options] - Additional options for the request.
 * @returns {Promise<{response: Object, refetch: Function}>} - The response object and a refetch function.
 * @throws Will throw an error if the request fails.
 */
export const deleteData = async (endpoint, options = {}) => {
  try {
    const config = createConfig(options);
    const response = await axios.delete(endpoint, config);
    return {
      response,
      refetch: () => deleteData(endpoint, options),
    };
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
