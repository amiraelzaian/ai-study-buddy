"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

type AnimationData = object;

export default function PageLoading() {
  const [animation, setAnimation] = useState<AnimationData | null>(null);

  useEffect(() => {
    fetch("/RobotLoading.json")
      .then((res) => res.json())
      .then((data) => setAnimation(data));
  }, []);

  if (!animation) return null;

  return <Lottie animationData={animation} loop className="z-10" />;
}
