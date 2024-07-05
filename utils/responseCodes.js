const response400 = (res, msg)=>{
    return res.status(400).json({
        message: msg,
        success: false
    })
}

const response200 = (res, msg, data)=>{
    return res.status(200).json({
        message: msg,
        data: data,
        success: true
    })
}

const response201 = (res, msg)=>{
    return res.status(201).json({
        message: msg,
        success: true
    })
}

export {response400, response200, response201};