import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUserRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRespository';


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveyUserRepository);

        //----------VERIFICATIONS-----------

        const userAlreadyExists = await usersRepository.findOne({ email });
    
        if(!userAlreadyExists){
            return response.status(400).json({
                error: 'User does not exists'
            });
        }


        const surveyAlreadyExists = await surveysRepository.findOne({ id: survey_id });
        
        if(!surveyAlreadyExists) {
            return response.status(400).json({
                error: 'Survey does not exists'
            });
        }
    

        //-----------IF !ERROR DO SAVE()-----------

        const surveyUser = surveysUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        })

        await surveysUserRepository.save(surveyUser);



        //-----------IF SAVE DO SENDMAIL-----------

        return response.status(201).json(surveyUser);
    }
};

export { SendMailController };
