import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';


class AnswerController {
    /*
        localhost:3333/answers/1?u=id
    
        Route params => Parametros de rota
        routes.get('/answers/:value');

        Query params => Busca, Paginação, não Obrigatoios
        ?
        chave=valor
    */

    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRespository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRespository.findOne({
            id: String(u)

        });

        if(!surveyUser) {
            throw new AppError ('Survey User does not exists!');
        };

        surveyUser.value = Number(value);

        await surveysUsersRespository.save(surveyUser);

        return response.json(surveyUser);
    };
}

export { AnswerController };

