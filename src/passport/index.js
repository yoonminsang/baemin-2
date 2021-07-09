import passport from 'passport';
import db from '../db/index.js';
import Strategy from 'passport-local';
import bcrypt from 'bcrypt';
const LocalStrategy = Strategy.Strategy;

const passportConfig = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // const user = db
      //   .get('users')
      //   .find({
      //     id,
      //   })
      //   .value();
      // const copyUser = Object.assign({}, user);
      // delete copyUser.password;
      // console.log('deserialize', copyUser);
      const [user] = db
        .where(['id'], [id])
        .select(['id', 'email', 'nickname', 'birth']).snapshot;
      done(null, user);
    } catch (e) {
      console.error('deserialize error', e);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          console.log('local strategy', email);
          // const user = db
          //   .get('users')
          //   .find({
          //     email,
          //   })
          //   .value();
          const [user] = db.where(['email'], [email]).snapshot;
          if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) return done(null, user);
            return done(null, false);
          }
          return done(null, false);
        } catch (e) {
          console.error('local passport error', e);
        }
      },
    ),
  );
};
export default passportConfig;
