import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <div className="bg-red-400 text-center p-2">Not found</div>
      <Link className="text-center mx-auto" to={"/"}>Go home</Link>
    </div>
  );
}
