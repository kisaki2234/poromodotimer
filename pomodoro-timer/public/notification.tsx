import React, { useRef, useEffect } from "react";

// In your component
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  audioRef.current = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.wav");
}, []);