import Image from "next/image";
import React from "react";
import Sidebar from "../components/sidebar";
import Link from "next/link";

export default function Home() {
  return (
    <div data-theme="luxury" className="items-center justify-center h-screen flex flex-col">
      <Sidebar />
      <div>
        <button className="btn capitalize mb-10">
          <Link className="text-center items-center px-10" href='login'>Proceed to login</Link>
        </button>
      </div>
    </div>
  );
}
