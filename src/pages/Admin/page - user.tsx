
import React from 'react'
import { GetUserByAdminResponseDTO } from '../../models';
import { UserTableAdapter } from './adapter - userTable'
import { userAPIInstance } from '../../config';
import { toast } from 'react-toastify';

export const UserTablePage: React.FC<{}> = () => {
    const [state, setState] = React.useState<UserInspectPageState>({
        data: [],
        loading: false
    });
    const [displayedModal, displayModal] = React.useState(false);

    const functions = {
        updateUserEnabled(userId: number, isBlocked: boolean){
            setState(o =>({
                ...o,
                data: o.data.map(user =>{
                    console.log(`${user.id} === ${userId}`, user.id === userId)
                    return user.id === userId ? {
                        ...user,
                        enabled: !isBlocked
                    } : user
                })
            }))
        },
        fetchUserData(){
            userAPIInstance.getUserList().then(response =>{
                if(Array.isArray(response.data)){
                    setState(o =>({
                        ...o,
                        data: response.data
                    }));
                }
            }).catch(error =>{
                toast.error(error.response.data);
            })
        },
        blockOrUnlockUser(userId: number, isBlocked: boolean){
            userAPIInstance.blockOrUnlockUser(userId, isBlocked)
            .then(response =>{
                if(response.data){
                    toast.success(response.data?.message);
                    this.updateUserEnabled(userId, isBlocked);
                }
            }).catch(error =>{
                toast.error(error.response?.data || "cannot send request to server");
            });
        }
    }
    
    React.useEffect(() =>{
        functions.fetchUserData();
    },[])

    return (
        <section className='p-3'>
            <article className='px-4 py-4'>
                <h3>User List</h3>
                <i>User collection</i>
            </article>
            <UserTableAdapter 
                data={state.data.map(item =>{
                    const {id, organizationName, avatar, biography, enabled, email} = item;
                    return {
                        id,
                        "user": {
                            title: organizationName,
                            image: avatar
                        },
                        biography,
                        email,
                        enabled: {
                            status: enabled ? "success" : "danger",
                            title: enabled ? "In activity" : "Blocked",
                        }
                    }
                })} 
                hasAction
                onBlocked={(rowNumber) =>{
                    functions.blockOrUnlockUser(state.data?.[rowNumber]?.id, true);
                }}
                onUnlocked={(rowNumber) =>{
                    functions.blockOrUnlockUser(state.data?.[rowNumber]?.id, false);
                }}
            ></UserTableAdapter>
        </section>
    )
}

type UserInspectPageState = {
  data: GetUserByAdminResponseDTO[];
  loading: boolean;
}