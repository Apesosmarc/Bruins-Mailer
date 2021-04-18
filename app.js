require("dotenv").config();

const PORT = process.env.PORT;
const cron = require("node-cron");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const date = new Date();

console.log("logged in");

let mailOptions = {
  from: "bruinsupdate@gmail.com",
  to: "apesos2013@gmail.com, apesossteve@gmail.com",
  subject: "BRUINS GAME TODAY",
  text: "",
  template: "index",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function getData() {
  fetch("https://statsapi.web.nhl.com/api/v1/schedule?teamId=6")
    .then((res) => res.json())
    .then((data) => {
      if (!data.date[0].games[0]) {
        throw new Error("no game today");
      }
      const awayTeam = data.dates[0].games[0].teams.away.team.name;
      const homeTeam = data.dates[0].games[0].teams.home.team.name;
      const date = new Date(
        data.dates[0].games[0].gameDate
      ).toLocaleDateString();
      const time = new Date(
        data.dates[0].games[0].gameDate
      ).toLocaleTimeString();

      console.log(date);

      const gameInfo = `${date}: ${awayTeam} @ ${homeTeam} ${time}`;

      mailOptions.text = gameInfo;
    })
    .then((data) => {
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("error ", err);
        } else {
          console.log("email sent");
        }
      });
    })
    .catch((e) => console.log(e));
}

const bruinsFetch = cron.schedule(
  "0 11 * * 0-6",
  () => {
    getData();
  },
  {
    scheduled: true,
    timezone: "America/New_York",
  }
);
