import { connect } from "$lib/server/db";

connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((e) => {
    console.error(e);
  });
