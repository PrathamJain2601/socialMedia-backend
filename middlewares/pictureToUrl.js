export const pictureToUrl = (req, dbLink)=>{
    const profilePicLocalPath = dbLink;
    const profilePicUrl = `${req.protocol}://${req.get('host')}/${profilePicLocalPath}`;
    return profilePicUrl;
}