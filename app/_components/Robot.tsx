"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

type AnimationData = object;

export default function Robot() {
  const [animation, setAnimation] = useState<AnimationData | null>(null);

  useEffect(() => {
    fetch("/robot.json")
      .then((res) => res.json())
      .then((data) => setAnimation(data));
  }, []);

  if (!animation) return null;

  return <Lottie animationData={animation} loop className="z-10" />;
}
