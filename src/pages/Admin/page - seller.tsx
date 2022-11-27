import React from 'react'
import { toast } from 'react-toastify';
import { sellerAPIInstance } from '../../config';
import { GetUserPageResponseDTO } from '../../models';
import { SellerTableAdapter } from './adapter - sellerTable';

export const SellerTable: React.FC<{}> = () => {
    const [state, setState] = React.useState<UserInspectPageState>({
        data: [],
        loading: false
    });

    const functions = {
        fetchUserData(){
            sellerAPIInstance.getSellerList().then(response =>{
                if(Array.isArray(response.data)){
                    setState(o =>({
                        ...o,
                        data: response.data
                    }));
                }
            }).catch(error =>{
                toast.error(error.response.data);
            })
        }
    }
    
    React.useEffect(() =>{
        functions.fetchUserData();
    },[])

    return (
        <section className='p-3'>
            <article className='px-4 py-4'>
                <h3>Seller List</h3>
                <i>Seller collection</i>
            </article>
            <SellerTableAdapter 
                data={state.data
                    .map(item =>{
                        const {id, name, biography, description, pageAvatar, email, phone} = item;
                        return {
                            id,
                            "name": {
                                title: name,
                                image: pageAvatar
                            },
                            "contact": [email, phone],
                            biography,
                            description
                        }
                    })
                } 
                hasAction
                onBlocked={(rowNumber) =>{}}
                onUnlocked={(rowNumber) =>{}}
            ></SellerTableAdapter>
        </section>
    )
}

type UserInspectPageState = {
  data: GetUserPageResponseDTO[];
  loading: boolean;
}