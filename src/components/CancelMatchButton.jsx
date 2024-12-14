import React from "react";
import LoadingScreen from "./LoadingScreen";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const CancelMatchButton = ({handleCancelMatch}) => {
  return (
    <div className="bg-blue-800 hover:bg-blue-900 mx-auto flex items-center justify-center pr-6" onClick={handleCancelMatch}>
      <div className="scale-75">
        <LoadingScreen />
      </div>
      <Button varient="icon " size={"xs"} className='bg-transparent'><X color="red" size={20}/></Button>
    </div>
  );
};

export default CancelMatchButton;
