/* eslint-disable import/prefer-default-export,class-methods-use-this */

// application
import axios from 'axios';
import {
    AccountApi,
    IEditAddressData,
    IEditProfileData,
} from '~/api/base';
import {
    accountChangePassword,
    accountSignOut,
    delAddress,
    editAddress,
    getAddress,
    getAddresses,
    getDefaultAddress,
    getOrderById,
    getOrderByToken,
    getOrdersList
} from '~/fake-server/endpoints';
import { IAddress } from '~/interfaces/address';
import { IListOptions, IOrdersList } from '~/interfaces/list';
import { IOrder } from '~/interfaces/order';
import { IUser } from '~/interfaces/user';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

if (typeof window !== 'undefined') {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    } else {
      console.error('CSRF token not found in the meta tags.');
    }
  }

export class FakeAccountApi extends AccountApi {
    async signIn(email: string, password: string): Promise<IUser> {
        const apiUrl = 'https://azantest.gmgsolution.com/api/login';
    
        try {
            const response = await axios.post<{ token: string, user: IUser }>(
                apiUrl,
                { email, password },
                {
                    withCredentials: true, // Set this to false if you don't want to send cookies
                }
            );
    
            // Check the structure of the response
            console.log('Response data:', response.data);
    
            // Assuming the token is at the top level of the response
            const { token, user } = response.data;
    
            // Store the token in localStorage
            localStorage.setItem("token", token);
    
            return user;
        } catch (error) {
            console.error('Sign-in failed:', error);
            throw error;
        }
    }
    

    async signUp(email: string, password: string): Promise<IUser> {

        const signUpData = {
            email,
            password,
        };

        return axios.post<{ user: IUser }>('https://azantest.gmgsolution.com/api/register', signUpData)
            .then((response) => {
                // Handle the success response (optional)

                const { user } = response.data;

                return user; // Return the user object
            })
            .catch((error) => {
                // Handle error, e.g., show an error message to the user
                console.error('Error during sign-up:', error);
                throw error;
            });

    }

    signOut(): Promise<void> {
        return accountSignOut();
    }

    async editProfile(data: IEditProfileData): Promise<IUser> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post<any>('https://azantest.gmgsolution.com/api/user/edit-Profile', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log("Response data:", response.data);
    
            // Check the structure of the response to access the user data correctly
            // Assuming the user data is directly available in response.data or its nested structure
            const user: IUser = response.data?.user; // Adjust this based on the actual structure
    
            if (!user) {
                throw new Error('User data not found in response');
            }
    
            return user;
        } catch (error) {
            console.error('Error during profile edit:', error);
            throw error;
        }
    }
    

    changePassword(oldPassword: string, newPassword: string): Promise<void> {
        return accountChangePassword(oldPassword, newPassword);
    }

    async addAddress(data: IEditAddressData): Promise<IAddress> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post<any>('https://azantest.gmgsolution.com/api/create-address', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log("Response data:", response.data);
    
            // Access the 'address' property if it exists in the response, adjust this based on the actual response structure
            const address: IAddress = response.data?.address;
    
            if (!address) {
                throw new Error('Address data not found in response');
            }
    
            return address;
        } catch (error) {
            console.error('Error while adding address:', error);
            throw error;
        }
    }
    

    editAddress(addressId: number, data: IEditAddressData): Promise<IAddress> {
        return editAddress(addressId, data);
    }

    delAddress(addressId: number): Promise<void> {
        return delAddress(addressId);
    }

    getDefaultAddress(): Promise<IAddress | null> {
        return getDefaultAddress();
    }

    getAddress(addressId: number): Promise<IAddress> {
        return getAddress(addressId);
    }

    getAddresses(): Promise<IAddress[]> {

        return getAddresses();
    }

    getOrdersList(options?: IListOptions): Promise<IOrdersList> {
        return getOrdersList(options);
    }

    getOrderById(id: number): Promise<IOrder> {
        return getOrderById(id);
    }

    getOrderByToken(token: string): Promise<IOrder> {
        return getOrderByToken(token);
    }
}
