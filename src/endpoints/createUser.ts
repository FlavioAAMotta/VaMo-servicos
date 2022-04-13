import {Request, Response} from "express";
import { getAddressInfo } from "../services/getAddressInfo";
import transporter from "../services/mailTransporter";


export const createUser = async (req: Request, res: Response) =>{
    try {
        const {zipcode, email, password} = req.body
        const address = await getAddressInfo(zipcode)
        if(!address) {
            throw new Error("Error on get address")
        }
        
        const emailInfo = await transporter.sendMail({
            from: `${process.env.NODEMAILER_USER}`,
            to: `${email}`,
            subject: "Usuário criado com sucesso",
            text: "Parabéns seu usuário foi criado com sucesso no labefoods",
            html: `<p><strong>Olá, parabéns por se inscrever conosco.</strong> Segue seus dados:
            PASSWORD: <em>${password}</em>
            ENDEREÇO: ${address.city}/${address.state} ${address.district} ${address.street}</p>` 
        })

        res.send({emailInfo, message:"Cadastro concluído com sucesso"})
    } catch (error) {
        if(error instanceof Error){
            res.send({error, message:error.message})
        }else{
            res.send({message: "Unexpected error"})
        }
    }
}