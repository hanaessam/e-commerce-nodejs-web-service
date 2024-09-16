# All the time durations provided are in minutes and seconds format, so we'll first convert them to just minutes
# Then, sum up the total time and convert it to hours.

time_durations = [
   (26, 46), (3, 38), (12, 4),
    (5, 13), (19, 51), (27, 46), (8, 52), (3, 29), (11, 52), (5, 8), (6, 43), (12, 20), (6, 20), (3, 48), 
    (2, 7), (3, 6), (7, 9), (3, 6), (6, 7), (5, 19), (16, 18), (12, 21), (9, 52), (4, 53), (7, 58), (3, 15), 
    (10, 33), (15, 15), (2, 12), (1, 24), (9, 33), (8, 32), (8, 21), (12, 49), (13, 24), (10, 33), (4, 4),
    (10, 19), (2, 2), (6, 3), (8, 17), (22, 52), (10, 50), (8, 20), (18, 22), (28, 50), (6, 7), (2, 36),
    (3, 21), (5, 7), (11, 8), (9, 49), (12, 36), (16, 43), (9, 37), (2, 40), (5, 22)
]

# Converting time to total minutes
total_minutes = sum([minutes + seconds / 60 for minutes, seconds in time_durations])

# Convert the total minutes to hours
total_hours = total_minutes / 60

print(total_hours)
