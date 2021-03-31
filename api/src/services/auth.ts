import passport from 'passport';
import passportJWT from 'passport-jwt';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';

const { ExtractJwt, Strategy } = passportJWT;

export default () => {
  const opts = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(opts, (payload, done) => {
    getCustomRepository(UsersRepository)
      .findOne(payload.id)
      .then((user) => {
        if (user) {
          return done(null, {
            id: user.id,
            name: user.name,
          });
        }
        return done(null, false);
      })
      .catch((error) => done(error, null));
  });

  passport.use(strategy);

  const sessionBool = JSON.parse(process.env.JWT_SESSION) || false;

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: sessionBool }),
  };
};
