import {Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { AppError } from '../errors/AppError';
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from '../repositories/UsersRespository';


class SurveysController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const surveyAlreadyExists = await surveysRepository.findOne({ title });
        if(surveyAlreadyExists) {
            throw new AppError ('Survey already exists!');
        }

        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.status(200).json(all);
    }
}

export { SurveysController };
