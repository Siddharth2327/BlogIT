import { axiosInstance } from "./index.js"

export const RegisterUser = async (values) => {
  try {
    const response = await axiosInstance.post('http://localhost:8080/api/users/register', values);
    console.log('User Registered');
    return response.data
  } catch (error) {
    console.log('Registration error:', error);
  }
};

export const LoginUser = async (values) => {
  try {
    const response = await axiosInstance.post("http://localhost:8080/api/users/login", values);

    //return data only if response exists
    return response.data
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);
    return { success: false, message: "Server error. Try again later." };
  }
};


// get valid user by for checking the bearer token
export const GetCurrentUser = async()=>{
  try{
    const response = await axiosInstance.get('http://localhost:8080/api/users/validate-user')
    // console.log(response.data)
    return response.data
  } catch(error){
    console.log('Error while verifying valid user ',error)
  }
};
