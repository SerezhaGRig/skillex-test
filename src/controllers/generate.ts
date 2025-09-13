import { Router, Request, Response, NextFunction } from 'express';
import { buildGenerateService } from '../services/generate';
import { generateSchema } from '../validators';
import { getMysqlConnPool } from '../instances/dbConnection';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validReqBody = generateSchema.parse(req.body);
    const generateService = buildGenerateService(getMysqlConnPool());
    const response = await generateService(validReqBody);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export const generateRouter = router;
