export const updateUserInfo = (updatedData) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        const userInfor = JSON.parse(storedUser);
        const normalizedData = {
            UserId: updatedData.userId,
            Avatar: updatedData.avatar,
            UserName: updatedData.userName,
            CoverPhoto: updatedData.coverPhoto,
            Bio: updatedData.bio,
            Birthday: updatedData.birthday,
            Sex: updatedData.sex,
            PhoneNumber: updatedData.phoneNumber
        };
        const newUserInfor = { ...userInfor, ...normalizedData };
        localStorage.setItem("user", JSON.stringify(newUserInfor));
        console.log(localStorage.getItem("user"))
        console.log("Cập nhật thành công:", newUserInfor);
    }
};