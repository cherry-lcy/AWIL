import pandas as pd

path = ""

# Read the Excel file
data = pd.read_excel(path + '\\tool_set.xlsx', header=None)

print(data.head(), type(data), len(data))

# Extract the first three rows as option groups (0:theme, 1:subtheme, 2:category)
option_grp = data.iloc[0:3].values.tolist()
option_grp = [option_grp[0][1:], option_grp[1][1:], option_grp[2][1:]]

rows = []

# Find out all the categories that a name falls under
for i in range(3, len(data)):
    for j in range(len(option_grp[0])):
        if data.iloc[i, j+1] == "x":
            rows.append({
                "name": i-2,
                "theme": option_grp[0][j],
                "subtheme": option_grp[1][j],
                "category": option_grp[2][j]
            })

# Convert rows to a dataframe and sort it
processed_data = pd.DataFrame(rows)
processed_data = processed_data.sort_values(by='name')

print(processed_data.head(), type(processed_data), len(processed_data))

# Save the processed data to a CSV file
processed_data.to_csv(path + '\\processed_data.csv', index=False)