# Valorant Stats

A Next.JS web application to track our Valorant team ranking progress

## API

This app uses Henrikdev's custom [Valorant API](https://docs.henrikdev.xyz/valorant.html) to fetch data.

## Firebase Firestore Structure

The project database has **two collections:** players and eloprogress.

### Players

As the name suggests, this collection stores the players data.
Each document has an unique ID, which is the player's name.

![Players](https://imgur.com/b5AoGjy.png "Players")

Each player document has the following fields:

- currentMMR (number)
- docref (string)
- elo (number)
- maincharacter (string)
- name (string)
- pictureurl (string)
- riotid (string)
- tag (string)

### Elo Progess

This collection stores the player's elo progress across time.

![Elo Progress](https://imgur.com/YRpIWo8.png "Elo Progress")

Each player document **has the same ID from the players collection**, and has a subcollection called **data**.

Each document inside **data** is named using dd-m-yyyy structure.

![Data](https://imgur.com/vgrYyIE.png "Data")

Each data document has the following fields:

- MMR (number)
- elo (number)
- eloname (string)
- pdl (number)
- timestamp (timestamp)

## Me segue no Instagram!

<a href="https://www.instagram.com/eiji.tomonari/"><img align="left" src="https://raw.githubusercontent.com/yushi1007/yushi1007/1f3f3e189376e20a38857f06c588eaae182998ab/images/instagram.svg" alt="icon | LinkedIn" width="21px"/>@eiji.tomonari</a><br>
