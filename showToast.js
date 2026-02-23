export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  
  // Set custom styles based on type
  if (type === "error") {
    toast.style.backgroundColor = "#e53e3e"; // Red for errors
    toast.style.boxShadow = "0 4px 12px rgba(229, 62, 62, 0.3)";
  } else {
    toast.style.backgroundColor = "#38a169"; // Green for success
    toast.style.boxShadow = "0 4px 12px rgba(56, 161, 105, 0.3)";
  }

  toast.textContent = message;

  document.body.appendChild(toast);

  // Automatically remove the toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.5s ease";
    
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}
