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

const SUBMITBUTTON_STYLES={
  position: "fixed",
  borderRadius: "25px",
  left: "25%",
  backgroundColor: "#73AD21",
  width:"20%",
  alignItems: "center"
}

export default function AddCustomerModal( { open, onClose} ) {

      const [first, setFirst] = useState('')
      const [last, setLast] = useState('')
      const [email, setEmail] = useState('')
      const [address, setAddress] = useState('')
      const [postal, setPostal] = useState('')
      const [phone, setPhone] = useState('')

      if (!open){return null}


      function reloadPage(){
      window.location.reload();
      }

      function fillData(){
        let data = {}
        data["first_name"] = first
        data["last_name"] = last
        data["email"] = email
        data["address"] = address
        data["postal_code"] = postal
        data["phone"] = phone
        postData(data)
        reloadPage()
      }

    async function postData(data){
      if (!data){return}

      const response = await fetch("/addCustomer",{ 
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
                <h3>CUSTOMER INFO:</h3>
                <input placeHolder="First Name" style={{width:"80%"}}type="text" onChange={(e)=>setFirst(e.target.value)}/>
                <input placeHolder="Last Name" style={{width:"80%"}}type="text" onChange={(e)=>setLast(e.target.value)}/>
                <input placeHolder="Email" style={{width:"80%"}}type="text" onChange={(e)=>setEmail(e.target.value)}/>
                <input placeHolder="Address" style={{width:"80%"}}type="text" onChange={(e)=>setAddress(e.target.value)}/>
                <input placeHolder="ZipCode" style={{width:"80%"}}type="text" onChange={(e)=>setPostal(e.target.value)}/>
                <input placeHolder="Phone #" style={{width:"80%"}}type="text" onChange={(e)=>setPhone(e.target.value)}/>
                <br/>
              </div>
              <div>
                <button disabled={!email || !first || !last||  !address || !postal || !phone} style={SUBMITBUTTON_STYLES} onClick={fillData}>
                    <font color="white">
                      SUBMIT
                    </font>
                </button>
              </div>
            </div>
          </div>
        </>,
        document.getElementById("portal")
      )
}