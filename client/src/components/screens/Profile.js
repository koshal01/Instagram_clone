import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom';

const Profile  = ()=>{
    const [mypics,setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
               "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
           setPics(result.mypost);
        })
    },[]);

    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta-clone");
            data.append("cloud_name","koshal");

            fetch("https://api.cloudinary.com/v1_1/koshal/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
       
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image]);

    const updatePhoto = (file)=>{
        setImage(file)
    };

    return (
        <div style={{maxWidth:"620px",margin:"0px auto"}}>
            <div style={{ margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div style={{display:"flex", justifyContent:"space-around",}}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={state?state.pic:"loading"} alt={"profile"}
                        />
                    </div>
                    <div>
                        <h4>{state?state.name:"loading"}</h4>
                        <h6>{state?state.email:"loading"}</h6>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6><b>{mypics.length}</b> posts</h6>
                            <Link to={state?"/followers/"+state._id:"0"}><h6><b>{state?state.followers.length:"0"}</b> followers</h6></Link>
                            <Link to={state?"/following/"+state._id:"0"}><h6><b>{state?state.following.length:"0"}</b> following</h6></Link>
                        </div>
                    </div>
                </div>
        
                <div className="file-field input-field" style={{margin:"10px 80px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>      
            <div className="gallery row">
            {
                mypics.map(item=>{
                    return(
                        <div className="column" key={item._id}>
                            <Link to={"/post/"+state._id}>
                                <img key={item._id} src={item.photo} alt={item.title} style={{width:"100%"}}/>  
                            </Link>
                        </div>
                    )
                })
            }
            </div>
        </div>
    );
};

export default Profile;