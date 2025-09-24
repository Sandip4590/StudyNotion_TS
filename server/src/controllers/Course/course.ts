import { Request, Response } from 'express';
import { ICourse } from '@/Types/course.type';
import { Course } from '@/models/Course';
import User from '@/models/User';
import Tag from '@/models/Tags';
import { uploadImageToCloudinary } from '../utils/imageUploader';
import { logger } from '@/lib/winston';

export const createCourse = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body as ICourse;
    const thumbnail = (req.files as any)?.thumbnailImage;

    if (!thumbnail) {
      logger.warn('Thumbnail missing', { userId: req.user?.id });
      return res
        .status(400)
        .json({ success: false, message: 'Thumbnail is required' });
    }

    const instructorDetails = await User.findById(req.user?.id);
    if (!instructorDetails) {
      logger.error('Instructor not found', { userId: req.user?.id });
      return res
        .status(404)
        .json({ success: false, message: 'Instructor not found' });
    }

    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      logger.error('Tag not found', { tag });
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME as string,
    );

    const newCourse: ICourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    logger.info('Course created successfully', { courseId: newCourse._id });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error: any) {
    logger.error('Error creating course', { error: error.message });
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const showAllCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const allCourses = await Course.find({});

    logger.info('Fetched all courses successfully', {
      count: allCourses.length,
    });

    res.status(200).json({
      success: true,
      message: 'Data for all courses fetched successfully',
      data: allCourses,
    });
  } catch (error: any) {
    logger.error('Error fetching all courses', {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: 'Cannot fetch course data',
      error: error.message,
    });
  }
};



export const editCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, ...updates } = req.body;

    if (!courseId) {
      logger.warn("Course ID missing in request body");
      res.status(400).json({ success: false, message: "Course ID is required" });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      logger.warn(`Course not found: ${courseId}`);
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    if (req.files && "thumbnailImage" in req.files) {
      logger.info(`Updating thumbnail for course: ${courseId}`);
      const thumbnail = (req.files as any).thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME || "courses"
      );
      updates.thumbnail = thumbnailImage.secure_url;
    }

    if (updates.tag && typeof updates.tag === "string") {
      updates.tag = JSON.parse(updates.tag);
    }
    if (updates.instructions && typeof updates.instructions === "string") {
      updates.instructions = JSON.parse(updates.instructions);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updates },
      { new: true }
    )
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    logger.info(`Course updated successfully: ${courseId}`);

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error: any) {
    logger.error("Error updating course", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

