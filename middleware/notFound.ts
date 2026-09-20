import type { NextFunction, Request, Response } from "express"

// const notFound= (req: Request, res: Response, next: NextFunction)=>{
//     const error= new Error(`Not Found - ${req.url}`)
//     error.status= 404
//     next(error)
// }

const notFound= (req: Request, res: Response, next: NextFunction)=>{
    return res.status(404).json({sussess: false, message: `Not Found - ${req.url}`})
}

export default notFound