function getData() {
  fetch("https://statsapi.web.nhl.com/api/v1/schedule?teamId=6")
    .then((res) => res.json())
    .then((data) => {
      const awayTeam = data.dates[0].games[0].teams.away.team.name;
      const homeTeam = data.dates[0].games[0].teams.home.team.name;
      const date = new Date(
        data.dates[0].games[0].gameDate
      ).toLocaleDateString();
      const time = new Date(
        data.dates[0].games[0].gameDate
      ).toLocaleTimeString();

      console.log(date);

      document.getElementById(
        "teams"
      ).innerHTML = `${date}:    ${awayTeam} <b>@</b> ${homeTeam} <b>${time}</b>`;

      return date;
    });
}
getData();
