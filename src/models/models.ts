import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class People {
  @PrimaryColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  birth!: string;
}

@Entity()
export class Directors {
  @PrimaryColumn()
  movie_id!: number;
  @PrimaryColumn()
  person_id!: number;
}

@Entity()
export class Movies {
  @PrimaryColumn()
  movie_id!: number;
  @Column()
  title!: string;
  @Column()
  year!: number;
}

@Entity()
export class Ratings {
  @PrimaryColumn()
  movie_id!: number;
  @Column()
  rating!: number;
  @Column()
  votes!: number;
}

@Entity()
export class Stars {
  @PrimaryColumn()
  movie_id!: number;
  @PrimaryColumn()
  person_id!: number;
}

@Entity({ name: "userinfo" })
export class UserInfo {
  @PrimaryColumn()
  user_id!: number;
  @Column()
  first_name!: string;
  @Column()
  last_name!: string;
  @Column()
  gender!: string;
  @Column()
  date_of_birth!: string;
}

@Entity()
export class FavouriteMovies {
  @PrimaryColumn()
  user_id!: number;
  @PrimaryColumn()
  movie_id!: number;
}
