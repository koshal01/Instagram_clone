import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams, Link} from 'react-router-dom';

const Posts  = ()=>{
    const [data,setData] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    
    useEffect(()=>{
        fetch(`/getsubpost/${userid}`,{
            headers:{
               "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[]);

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
        const newData = data.map(item=>{
            if(item._id===result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
        }).catch(err=>{
            console.log(err)
        });
    };

    const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
        const newData = data.map(item=>{
            if(item._id===result._id){
                return result;
            }else{
                return item;
            }
        });
        setData(newData);
        }).catch(err=>{
            console.log(err);
        });
    };

    const makeComment = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+ localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              const newData = data.map(item=>{
                if(item._id===result._id){
                    return result;
                }else{
                    return item;
                }
             })
            setData(newData);
          }).catch(err=>{
              console.log(err);
          });
    };

    const deleteComment = (postId,commentId)=>{
        fetch('/deletecomment',{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: postId,
                commentId: commentId
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        });
    };

    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}>
                                <img style={{width:"20px",height:"20px",borderRadius:"25px", marginRight:"5px", marginBottom:"-3px"}}
                                src={state?item.postedBy.pic:"loading"}/>
                                <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>
                                    {item.postedBy.name}
                                </Link>
                            </h5>
                            
                            <div className="card-image">
                                <img src={item.photo} alt="man"/>
                            </div>
                            
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {item.likes.includes(state._id)
                                ? 
                                 <i className="material-icons"
                                     onClick={()=>{unlikePost(item._id)}}
                                 >thumb_down</i>
                                : 
                                 <i className="material-icons"
                                    onClick={()=>{likePost(item._id)}}
                                 >thumb_up</i>
                                }
                        
                                <h6>
                                    <b>{item.likes.length}</b> likes<br />
                                    {item.title}
                                    <p><b>{item.postedBy.name}</b>&ensp;{item.body}</p>
                                </h6>
                                {
                                    item.comments.map(record=>{
                                        return(
                                           <h6 key={record._id}>
                                               <span><b>{record.postedBy.name}</b></span>&ensp;{record.text}
                                               {record.postedBy._id === state._id && <i className="material-icons" style={{float:"right"}} 
                                                onClick={()=>deleteComment(item._id,record._id)}
                                                >delete</i>}
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />  
                                </form>
                            </div>
                        </div> 
                    )
                })
            }
        </div>
    );
};

export default Posts;