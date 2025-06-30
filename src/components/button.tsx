"use client"
import { deleteUser } from "@/actions/eliminarUsuario";
import { Button } from "@/components/ui/button";

const Deletebutton=() =>{
    const handleClick = async () => {deleteUser}
    return <Button onClick={handleClick}>hola</Button>
}

export default Deletebutton;