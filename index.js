setTimeout(() => {
    const left = document.getElementById('left');
  
    // 👇️ removes element from DOM
    left.style.visibility = 'hidden';
  
    // 👇️ hides element (still takes up space on page)
    // box.style.visibility = 'hidden';
  }, 50000); // 👈️ time in milliseconds
  