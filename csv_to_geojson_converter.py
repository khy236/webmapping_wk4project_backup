# Adapted from: https://chenyuzuoo.github.io/posts/56646/

import csv

# Read in raw data from csv
rawData = csv.reader(open('data/202205-citibike-tripdata.csv', 'rt'), dialect='excel')

# the template. where data from the csv will be formatted to geojson
template = \
   ''' \
   { "type": "Feature",
       "geometry" : {
           "type": "Point",
           "coordinates": [%s,%s]},
       "properties": { "id" : "%s", "start_time" : "%s", "end_time": "%s", "bike_type" : "%s", "user_type": "%s", "start_lon": "%s", "start_lat": "%s", "end_lon": "%s", "end_lat": "%s"}
    },
   '''

# the head of the geojson file
output = \
   ''' \

{ "type": "FeatureCollection",
   "features" : [
   '''


# loop through the csv
iter = 0
i=0
for row in rawData:
   iter += 1
   i == 0
   # skip first row
   # exclude trips with start but no end
   # filter for trips on 5/5/22 (ebike launch date)
   # filter for ebike trips
   if iter >= 2 and (len(row[10]) != 0 or len(row[11]) != 0) and row[2][0:10] == "2022-05-05" and row[1][0:13] == "electric_bike":
      i +=1 # count output rows
      id = row[0]
      start_lat = row[8]
      start_lon = row[9]
      end_lat = row[10]
      end_lon = row[11]
      start_time = row[2]
      end_time = row[3]
      bike_type = row[1]
      user_type = row[12]
      output += template % (start_lon, start_lat, id, start_time, end_time, bike_type, user_type, start_lon, start_lat, end_lon, end_lat, )
      #if i > 99: break


# the tail of the geojson file
output += \
   ''' \
   ]

}
   '''


# opens an geoJSON file to write the output
outFileHandle = open("data/220505citibike.geojson", "w")
outFileHandle.write(output)
outFileHandle.close()
