import React, {useState} from 'react'
import ReactDOM from 'react-dom';

const MODAL_STYLES={
  position: "fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  paddingTop:"50px",
  paddingBottom:"50px",
  paddingRight:"25px",
  zIndex:1000,
}

const OVERLAY_STYLES={
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex:1000,
}

const BUTTON_STYLES={
  position:"fixed",
  background:"none",
  border:"none",
  right:"1%",
  height:"5px"
}

const MODHEAD_STYLES={
  position:"fixed",
  backgroundColor:"#112ae7de",
  top:0,
  left:0,
  right:0,
  height:"7%",
}

const BODY_STYLES={
  position:"relative",
  top:"15px",
  left:"25px",
  width:"30vw",
  paddingRight:"15px",
  paddingBottom:"25px",
  overflow:"hidden"
}

const ERROR_STYLES={
  fontSize: '0.9px',
  color: "#f70e0e",
  textAlign: "left"

}

const SUBMITBUTTON_STYLES={
  position: "fixed",
  borderRadius: "25px",
  left: "25%",
  backgroundColor: "#73AD21",
  width:"20%",
  alignItems: "center"
}

const DELETEBUTTON_STYLES={
  position: "fixed",
  borderRadius: "25px",
  left: "47%",
  backgroundColor: "#d21e1e",
  width:"20%",
  alignItems: "center"
}

function ErrorMSG({show}){
  if(!show){return null}
  return(
    <font color="#f50303">Invalid Email</font>
  )
}

export default function CustomerModal( { open, onClose, ID, AddresID} ) {
   
    const [phoneNum, setPhoneNum] = useState("")
    const [email, setEmail] = useState("")
    const [postal, setPostal] = useState("")
    const [address, setAddress] = useState("")

    const [error, setError] = useState(false)
    
    let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+$/

    function reloadPage(){
      window.location.reload();
    }

    function fillData(){
      let data = {}
      if (phoneNum !== ""){
        data["phone"] = phoneNum
      }
      if (email !== ""){
        if(!emailReg.test(email)){
          setError(true)
          console.log("invalid email")
          return;
        }
        data["email"] = email
      }
      if (postal !== ""){
        data["postal_code"] = postal
      }
      if (address !== ""){
        data["address"] = address
      }
      data["customer_id"] = ID
      data["address_id"] = AddresID

      postData(data)
      reloadPage()
    }

    function customerDelete(){
      let data={}
      data["customer_id"] = ID
      data["address_id"] = AddresID
      delCustomer(data)
      reloadPage()
    }


    async function postData(data){
      if (!data){return}

      const response = await fetch("/updateCustomer",{ 
        method:"POST", 
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })

      if (response.ok){
        //show success message 
        console.log("Success")
      }

      else{
          console.log("ERROR: could not edit customer data")
      }
    }

    async function delCustomer(data){
      if (!data){return}

      const response = await fetch("/deleteCustomer",{ 
        method:"POST", 
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })

      if (response.ok){
        //show success message 
        console.log("Success")
      }

      else{
          console.log("ERROR: could not delete customer data")
      }
    }

  if(!open) return null
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div style={MODHEAD_STYLES}>
            <button style={BUTTON_STYLES} onClick={onClose}>
              <font color="#FFFF">
                X
              </font>
            </button>
          </div>
          <div style={BODY_STYLES}>
            <h3>Email:</h3> <input id="email" style={{width:"80%"}} type="email" onChange={(e)=>{setEmail(e.target.value); setError(false)}}/>
            <div styles={ERROR_STYLES}><ErrorMSG show={error}/></div>
            <h3>Address:</h3> <input style={{width:"80%"}}type="text" onChange={(e)=>setAddress(e.target.value)}/>
            <h3>Postal:</h3> <input style={{width:"80%"}}type="text" onChange={(e)=>setPostal(e.target.value)}/>
            <h3>Phone:</h3> <input style={{width:"80%"}}type="text" onChange={(e)=>setPhoneNum(e.target.value)}/>
            <br/>
          </div>
          <div>
            <button style={SUBMITBUTTON_STYLES} onClick={fillData} disabled={!email && !address && !postal && !phoneNum}>
                <font color="white">
                  SUBMIT
                </font>
            </button>
            <button style={DELETEBUTTON_STYLES} onClick={customerDelete}>
              <font color="white">
                  DELETE
              </font>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}
