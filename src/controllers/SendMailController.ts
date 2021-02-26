import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUserRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRespository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';
import { User } from '../models/User';


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        //----------VERIFICATIONS-----------

        const user = await usersRepository.findOne({ email });
    
        if(!user){
            return response.status(400).json({
                error: 'User does not exists'
            });
        }


        const survey = await surveysRepository.findOne({ id: survey_id });
        
        if(!survey) {
            return response.status(400).json({
                error: 'Survey does not exists'
            });
        }


        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL,
        };

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {value: null}]
        });

        if(surveyUserAlreadyExists){
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //-----------IF !ERROR DO SAVE()-----------

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);

       

        //-----------IF SAVE DO SENDMAIL-----------
        
        

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.status(201).json(surveyUser);
    }
};

export { SendMailController };
