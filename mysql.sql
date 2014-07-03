CREATE TABLE `events` (
  `criticality` int(11) NOT NULL,
  `unix_timestamp` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_events` (`criticality`,`unix_timestamp`,`category`,`description`),
  KEY `events_category_index` (`category`),
  KEY `events_criticality_index` (`criticality`),
  KEY `events_unix_timestamp_index` (`unix_timestamp`)
)DEFAULT CHARSET=utf8;