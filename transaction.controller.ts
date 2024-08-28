import Transaction from "../models/transaction.model";
import { Request, Response } from "express";
import { CustomRequest } from "../../customRequest";

export const addTask = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (
      title == undefined ||
      title == "" ||
      description == "" ||
      description == undefined
    ) {
      return res
        .status(400)
        .json({ status: "failed", error: "Missing required field(s)" });
    }

    const newTask = new Task({
      title,
      description,
      user: req.user._id,
    });

    if (newTask) {
      await newTask.save();

      res.status(201).json({ status: "success", data: newTask });
    } else {
      res.status(400).json({ status: "failed", error: "Invalid task data" });
    }
  } catch (error) {
    console.log(
      "Error in addTask controller",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ status: "failed", error: "Internal Server Error" });
  }
};

export const getAllTasks = async (req: CustomRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!tasks) {
      res
        .status(404)
        .json({ status: "success", message: "No tasks were found" });
    }

    res.status(200).json({ status: "success", data: tasks });
  } catch (error) {
    console.error(
      "Error in getAllTasks: ",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ status: "failed", error: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (
      title == undefined ||
      title == "" ||
      description == "" ||
      description == undefined
    ) {
      return res
        .status(400)
        .json({ status: "failed", error: "Missing required field(s)" });
    }

    var updatedTask = null;
    updatedTask = await Task.findOneAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ status: "success", message: "No task was found" });
    }

    res.status(200).json({ status: "success", data: updatedTask });
  } catch (error) {
    console.error(
      "Error in updateTask: ",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ status: "failed", error: "Internal server error" });
  }
};

export const deleteTask = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedTask) {
      res.status(404).json({ status: "success", message: "No task was found" });
    }

    res.status(200).json({ status: "success", data: deletedTask });
  } catch (error) {
    console.error(
      "Error in deleteTask: ",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ status: "failed", error: "Internal server error" });
  }
};
