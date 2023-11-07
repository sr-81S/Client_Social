import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Resizer from "react-image-file-resizer";

const RegisterForm = () => {

    const [inputValue, setInputValue] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    })

    const [profile, setProfile] = useState()

    const handelChange = (e)=>{
        
        const {name, value} = e.target;
        setInputValue((preValue)=>{
            return {
                ...preValue,
                [name]: value,
            }
        })
    }

    //image resizer
    const resizeFile = (file) =>
        new Promise((resolve) => {
             Resizer.imageFileResizer(
                file,
                300,
                300,
                "JPEG",
                100,
                0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });


    const handelProfile = async(e)=>{
        // const file = e.target.files[0];
        // if(file){
        //     const reader = new FileReader();
        //     reader.readAsDataURL(file)
        //     reader.onloadend = ()=>{
        //         setProfile(reader.result)
        //     }
        // }
        try {
            const file = e.target.files[0];
            const image = await resizeFile(file);
            // console.log(image);
            setProfile(image)
          } catch (err) {
            console.log(err);
          }
    }


    const navigate = useNavigate();

    const navi =()=>{
        navigate('/')
    }

    // data send to database and create user for the application

    const register = async(e)=>{
        e.preventDefault();
        
        const {name, email, password, cpassword} = inputValue;
        if(!name || !email || !password || !cpassword){
            toast.warn("field missing",{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            
            return false;
        }

        if(password !== cpassword){
            toast.error('passwords do not match',{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })

            return false;
        }

        //console.log("servet start");

        const responce = await fetch('https://socialbackend-5kec.onrender.com/api/register',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password, cpassword, picture: profile}),
        })

        const resData = await responce.json();
        console.log(resData);

        if(responce.status >= 400 || !resData){
            toast.error('Error in user registration', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        }else{
            toast.success('User register successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });

            navigate('/')
        }

    }



  return (
    <div className='bg-gray-50 flex justify-center items-center min-h-screen' >
        <div className="bg-gray-100 flex p-3 shadow-xl max-w-3xl border rounded-2xl items-center">
            {/* image */}
            <div className='w-1/2 relative' >
                <img className='rounded-2xl opacity-70' src="https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                {profile?(<div className=' h-[200px] w-[200px] rounded-[50%] overflow-hidden inline-block shadow-xl absolute top-[20%] left-[23%] ' >
                    <img className='h-[200px] w-[200px] object-cover' src={profile} alt="profile" srcset="" />
                </div>):(<></>)}
            </div>
            {/* form  */}
            <div className='w-1/2 px-10' >
                <h2 className='text-lg font-bold text-[#074FB2] text-center' >Register</h2>
                
                <form className='flex flex-col gap-1 mt-5' action="">
                    <label className="ml-2 text-zinc-500" htmlFor="name">Name</label>
                    <input className='p-2 rounded-lg border' type="text" name="name" value={inputValue.name} onChange={handelChange} placeholder='Enter Your Names' />
                    <label className="ml-2 text-zinc-500" htmlFor="email">Email</label>
                    <input className='p-2 rounded-lg border' type="email" name="email" value={inputValue.email} onChange={handelChange} placeholder='Enter Your Email' />
                    <label className="ml-1 text-zinc-500" htmlFor="profile">Choose profile picture</label>
                    <input className='ml-1' type="file" name="prfile" accept="image/jpg, image/jpeg" onChange={handelProfile} />
                    <label className="ml-2 text-zinc-500" htmlFor="password">Password</label>
                    <input className='p-2 rounded-lg border' type="password" name="password" value={inputValue.password} onChange={handelChange} placeholder='Enter Your Password' />
                    <label className="ml-2 text-zinc-500" htmlFor="cpassword">Confirm Password</label>
                    <input className='p-2 rounded-lg border' type="password" name="cpassword" value={inputValue.cpassword} onChange={handelChange} placeholder='Confirm Password' />
                    <button className='bg-[#074FB2] text-white py-2 rounded-lg mt-3' onClick={register}  >Register</button>
                </form>

                <div className='grid grid-cols-3 items-center mt-4 text-gray-500'>
                    <hr className='border-gray-500' />
                    <p className='text-center' >OR</p>
                    <hr className='border-gray-500' />
                </div>

                <div className='flex justify-center  items-center gap-4 mt-4' >
                    <p className='text-[#074FB2] text-base' >Already have an account:</p>
                    <button className='py-2 px-4 bg-white border rounded-lg text-sm ' onClick={navi}  >Login</button>
                </div>

            </div>
        </div>
    </div>
  )
}

export default RegisterForm