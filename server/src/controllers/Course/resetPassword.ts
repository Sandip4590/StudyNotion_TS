import { Request, Response, NextFunction } from "express";
import brcypt from 'bcrypt'
import User from "@/models/User"; 
import { logger } from "@/lib/winston";

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { password, confirmPassword, token } = req.body as {
            password: string;
            confirmPassword: string;
            token: string;
        };

        if (!password || !confirmPassword || !token) {
            logger.warn("Reset password failed: Missing required fields");
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }

        if (password !== confirmPassword) {
            logger.warn("Reset password failed: Passwords do not match");
            res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
            return;
        }

        const userDetails = await User.findOne({ token });

        if (!userDetails) {
            logger.warn("Reset password failed: Invalid token");
            res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
            return;
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            logger.warn("Reset password failed: Token expired", {
                userId: userDetails._id,
            });
            res.status(403).json({
                success: false,
                message: "Token has expired. Please regenerate your token.",
            });
            return;
        }

        const hashedPassword = await brcypt.hash(password, 10);

        await User.findOneAndUpdate(
            { token },
            { password: hashedPassword, token: null, resetPasswordExpires: null },
            { new: true }
        );

        logger.info("Password reset successfully", { userId: userDetails._id });

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error: any) {
        logger.error("Error while resetting password", { error: error.message });
        res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
};
