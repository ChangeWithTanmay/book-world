export const TemplateEmail = (otp) => `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border-radius: 8px; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <div style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
        DOCTOR.<br>GO
    </div>
    <div style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; margin-bottom: 10px;">
        Verify your account
    </div>
    <div style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; margin: 10px 0;">
        ${otp}
    </div>
    <div style="font-family: Arial, sans-serif; font-size: 16px; margin-bottom: 20px;">
        Please use this code to verify your email and complete your account set up. The code will be valid for the next 5 minutes.
    </div>
    <div style="display: flex; justify-content: center; gap: 10px;">
        <a href="#" style="text-decoration: none; color: #000;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4d6wyiCpO9m-kdAnWIgeJTPFxsxZZf0GauQ&s" alt="Twitter" style="width: 24px; height: 24px;">
        </a>
        <a href="#" style="text-decoration: none; color: #000;">
            <img src="https://img.freepik.com/premium-psd/3d-instagram-icon-psd_1073073-2126.jpg?semt=ais_hybrid" alt="Instagram" style="width: 24px; height: 24px;">
        </a>
        <a href="#" style="text-decoration: none; color: #000;">
            <img src="https://i.pinimg.com/236x/68/8f/48/688f48f357a41ed19f24b79cd3aa4721.jpg" alt="Facebook" style="width: 24px; height: 24px;">
        </a>
    </div>
</div>`;
