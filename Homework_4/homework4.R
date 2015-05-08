library(ggplot2)
df=movies
df=df[,-c(4)]

write.csv(df, "movies.csv", row.names=FALSE)

#preprocessing for barplot 1

df1 <- df[]