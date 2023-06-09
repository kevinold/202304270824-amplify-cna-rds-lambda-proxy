// @ts-nocheck
//import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { sequelize, Stadium } from './sequelize';
//import stadiumData from './stadium-data.json';

const stadiumData = {
  "stadiums": [
      {
          "name": "Los Angeles Memorial Coliseum",
          "capacity": 93607,
          "location": "Los Angeles, California",
          "surface": "Natural grass",
          "roof": "Open",
          "team": "Los Angeles Rams",
          "yearOpened": "1923"
      },
      {
          "name": "MetLife Stadium",
          "capacity": 82500,
          "location": "East Rutherford, New Jersey",
          "surface": "UBU Speed Series S5-M Synthetic Turf",
          "roof": "Open",
          "team": "New York Giants",
          "yearOpened": "2010"
      },
      {
          "name": "MetLife Stadium",
          "capacity": 82500,
          "location": "East Rutherford, New Jersey",
          "surface": "UBU Speed Series S5-M Synthetic Turf",
          "roof": "Open",
          "team": "New York Jets",
          "yearOpened": "2010"
      },
      {
          "name": "FedEx Field",
          "capacity": 82000,
          "location": "Landover, Maryland",
          "surface": "Latitude 36 Bermuda Grass",
          "roof": "Open",
          "team": "Washington Football Team",
          "yearOpened": "1997"
      },
      {
          "name": "Lambeau Field",
          "capacity": 81435,
          "location": "Green Bay, Wisconsin",
          "surface": "Hybrid Grass-Synthetic",
          "roof": "Open",
          "team": "Green Bay Packers",
          "yearOpened": "1957"
      },
      {
          "name": "AT&T Stadium",
          "capacity": 80000,
          "location": "Arlington, Texas",
          "surface": "Matrix RealGrass artificial turf",
          "roof": "Retractable",
          "team": "Dallas Cowboys",
          "yearOpened": "2009"
      },
      {
          "name": "Arrowhead Stadium",
          "capacity": 76416,
          "location": "Kansas City, Missouri",
          "surface": "Latitude 36 Bermuda Grass",
          "roof": "Open",
          "team": "Kansas City Chiefs",
          "yearOpened": "1972"
      },
      {
          "name": "Empower Field at Mile High",
          "capacity": 76125,
          "location": "Denver, Colorado",
          "surface": "Kentucky Bluegrass",
          "roof": "Open",
          "team": "Denver Broncos",
          "yearOpened": "2001"
      },
      {
          "name": "Bank of America Stadium",
          "capacity": 75419,
          "location": "Charlotte, North Carolina",
          "surface": "Voyager Bermuda Grass",
          "roof": "Open",
          "team": "Carolina Panthers",
          "yearOpened": "1996"
      },
      {
          "name": "Mercedes-Benz Superdome",
          "capacity": 73000,
          "location": "New Orleans, Louisiana",
          "surface": "UBU Turf (artificial)",
          "roof": "Fixed",
          "team": "New Orleans Saints",
          "yearOpened": "1975"
      },
      {
          "name": "NRG Stadium",
          "capacity": 72220,
          "location": "Houston, Texas",
          "surface": "AstroTurf GameDay Grass 3D",
          "roof": "Retractable",
          "team": "Houston Texans",
          "yearOpened": "2002"
      },
      {
          "name": "New Era Field",
          "capacity": 71870,
          "location": "Orchard Park, New York",
          "surface": "A-Turf Titan 50 (artificial)",
          "roof": "Open",
          "team": "Buffalo Bills",
          "yearOpened": "1973"
      },
      {
          "name": "Georgia Dome",
          "capacity": 71250,
          "location": "Atlanta, Georgia",
          "surface": "FieldTurf Classic HD",
          "roof": "Fixed",
          "team": "Atlanta Falcons",
          "yearOpened": "1992"
      },
      {
          "name": "M&T Bank Stadium",
          "capacity": 71008,
          "location": "Baltimore, Maryland",
          "surface": "Latitude 36 Bermuda Grass",
          "roof": "Open",
          "team": "Baltimore Ravens",
          "yearOpened": "1998"
      },
      {
          "name": "Qualcomm Stadium",
          "capacity": 70561,
          "location": "San Diego, California",
          "surface": "Bandera Bermuda Grass",
          "roof": "Open",
          "team": "San Diego Chargers",
          "yearOpened": "1967"
      },
      {
          "name": "Lincoln Financial Field",
          "capacity": 69596,
          "location": "Philadelphia, Pennsylvania",
          "surface": "Desso GrassMaster",
          "roof": "Open",
          "team": "Philadelphia Eagles",
          "yearOpened": "2003"
      },
      {
          "name": "Nissan Stadium",
          "capacity": 69143,
          "location": "Nashville, Tennessee",
          "surface": "TifSport Bermuda Grass",
          "roof": "Open",
          "team": "Tennessee Titans",
          "yearOpened": "1999"
      },
      {
          "name": "Levi's Stadium",
          "capacity": 68500,
          "location": "Santa Clara, California",
          "surface": "Tifway II Bermuda Grass / Perennial Ryegrass mixture",
          "roof": "Open",
          "team": "San Francisco 49ers",
          "yearOpened": "2014"
      },
      {
          "name": "Heinz Field",
          "capacity": 68400,
          "location": "Pittsburgh, Pennsylvania",
          "surface": "Kentucky Bluegrass",
          "roof": "Open",
          "team": "Pittsburgh Steelers",
          "yearOpened": "2001"
      },
      {
          "name": "CenturyLink Field",
          "capacity": 68000,
          "location": "Seattle, Washington",
          "surface": "FieldTurf Revolution",
          "roof": "Open",
          "team": "Seattle Seahawks",
          "yearOpened": "2002"
      },
      {
          "name": "FirstEnergy Stadium",
          "capacity": 67431,
          "location": "Cleveland, Ohio",
          "surface": "Kentucky Bluegrass",
          "roof": "Open",
          "team": "Cleveland Browns",
          "yearOpened": "1999"
      },
      {
          "name": "EverBank Field",
          "capacity": 67246,
          "location": "Jacksonville, Florida",
          "surface": "Tifway 419 Bermuda Grass",
          "roof": "Open",
          "team": "Jacksonville Jaguars",
          "yearOpened": "1999"
      },
      {
          "name": "Lucas Oil Stadium",
          "capacity": 67000,
          "location": "Indianapolis, Indiana",
          "surface": "FieldTurf Classic HD",
          "roof": "Retractable",
          "team": "Indianapolis Colts",
          "yearOpened": "2008"
      },
      {
          "name": "Gillette Stadium",
          "capacity": 66829,
          "location": "Foxborough, Massachusetts",
          "surface": "FieldTurf Revolution",
          "roof": "Open",
          "team": "New England Patriots",
          "yearOpened": "2002"
      },
      {
          "name": "U.S. Bank Stadium",
          "capacity": 66200,
          "location": "Minneapolis, Minnesota",
          "surface": "UBU Speed Series S5-M Synthetic Turf",
          "roof": "Fixed",
          "team": "Minnesota Vikings",
          "yearOpened": "2016"
      },
      {
          "name": "Raymond James Stadium",
          "capacity": 65890,
          "location": "Tampa, Florida",
          "surface": "Tifway 419 Bermuda Grass",
          "roof": "Open",
          "team": "Tampa Bay Buccaneers",
          "yearOpened": "1998"
      },
      {
          "name": "Paul Brown Stadium",
          "capacity": 65515,
          "location": "Cincinnati, Ohio",
          "surface": "UBU Speed Series S5-M Synthetic Turf",
          "roof": "Open",
          "team": "Cincinnati Bengals",
          "yearOpened": "2000"
      },
      {
          "name": "Hard Rock Stadium",
          "capacity": 65326,
          "location": "Miami Gardens, Florida",
          "surface": "Platinum TE Paspalum",
          "roof": "Open",
          "team": "Miami Dolphins",
          "yearOpened": "1987"
      },
      {
          "name": "Ford Field",
          "capacity": 65000,
          "location": "Detroit, Michigan",
          "surface": "FieldTurf Classic HD",
          "roof": "Fixed",
          "team": "Detroit Lions",
          "yearOpened": "2002"
      },
      {
          "name": "University of Phoenix Stadium",
          "capacity": 63400,
          "location": "Glendale, Arizona",
          "surface": "Tifway 419 Bermuda Grass",
          "roof": "Retractable",
          "team": "Arizona Cardinals",
          "yearOpened": "2006"
      },
      {
          "name": "Soldier Field",
          "capacity": 61500,
          "location": "Chicago, Illinois",
          "surface": "Kentucky Bluegrass",
          "roof": "Open",
          "team": "Chicago Bears",
          "yearOpened": "1924"
      },
      {
          "name": "Allegiant Stadium",
          "capacity": 65000,
          "location": "Paradise, Nevada",
          "surface": "Bermuda grass",
          "roof": "Fixed",
          "team": "Las Vegas Raiders",
          "yearOpened": "2020"
      }
  ]
}

exports.handler = async function (event: any): Promise<any> {
  try {
    await sequelize.authenticate();
    await Stadium.sync({ force: true });
    for(const stadium of stadiumData.stadiums) {
      await Stadium.create(stadium);
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error)
    }
  }
  
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "message": "Stadium table and data successfully created." })
  };
};
