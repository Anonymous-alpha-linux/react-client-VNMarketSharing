
import React from 'react'
import { GetUserByAdminResponseDTO } from '../../models';
import { UserTableAdapter } from './adapter - userTable'
import { userAPIInstance } from '../../config';
import { toast } from 'react-toastify';

export const BlockTablePage: React.FC<{}> = () => {
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
                    const data = response.data as GetUserByAdminResponseDTO[];
                    setState(o =>({
                        ...o,
                        data: data.filter(p => !p.enabled)
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
                <h3>Block List</h3>
                <i>User collection</i>
            </article>
            <UserTableAdapter 
                data={state.data.map(item =>{
                    const {id, organizationName, avatar, biography,email, enabled} = item;
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
                onUnlocked={(rowNumber) =>{
                    console.log(state.data?.[rowNumber]);
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