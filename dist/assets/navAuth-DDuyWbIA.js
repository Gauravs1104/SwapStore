document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".sing_in_up"),t=JSON.parse(localStorage.getItem("user"));t?(e.innerHTML=`
      <a href="profile.html" style="font-size: 1.6rem; color: white; margin-right: 1.5rem;"><i class="fa-solid fa-user"></i> Hello, ${t.name.split(" ")[0]}</a>
      <a href="#" id="logoutBtn">LOGOUT</a>
    `,document.getElementById("logoutBtn").addEventListener("click",o=>{o.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("user"),alert("Logged out successfully!"),window.location.reload()})):e.innerHTML=`
      <a href="login.html">SIGN IN</a>
      <a href="register.html">SIGN UP</a>
    `});
